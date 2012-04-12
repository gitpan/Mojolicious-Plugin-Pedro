package Mojolicious::Plugin::Pedro::Controller;
use Mojo::Base 'Mojolicious::Controller';

our $VERSION = '0.02';

use PPI  ();

sub line_tokens {
    my $self = shift;
    my $line = $self->param('line') || '';

    my @tokens = ();

    my $doc = PPI::Document->new( \$line );

    my $doc_tokens = $doc->find('PPI::Token');
    require Params::Util;
    if ( Params::Util::_ARRAY0($doc_tokens) ) {

        for my $token (@$doc_tokens) {
            my $type    = 'text';
            my $content = $token->content;
            if ( $token->isa('PPI::Token::Word') ) {
                if (   $content eq 'my'
                    || $content eq 'use'
                    || $content eq 'say'
                    || $content eq 'print' )
                {
                    $type = 'keyword';
                }
                else {
                    $type = 'identifier';
                }
            }
            elsif ( $token->isa('PPI::Token::Operator') ) {
                $type = 'operator';
            }
            elsif ( $token->isa('PPI::Token::Quote') ) {
                $type = 'string';
            }
            elsif ( $token->isa('PPI::Token::Comment') ) {
                $type = 'comment';
            }
            push @tokens, { type => $type, value => $content };
        }
    }
    else {
        push @tokens, { type => "text", value => $line };
    }

    $self->render( json => \@tokens );
}

sub default {
    my $self = shift;

    # Render template "controller/default.html.ep"
    $self->render;
}

1;
